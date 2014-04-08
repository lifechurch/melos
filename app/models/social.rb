class Social

  def self.stager
    User.authenticate("BrittTheStager","password")
  end

  def self.noob
    User.authenticate("BrittTheNoob","password")
  end

  def self.tester
    User.authenticate("BrittTheTester","password")
  end

  def self.milesbrad
    User.authenticate("MilesBrad","password")
  end

  def self.matt
    User.authenticate("manderson", "qwerasdf")
  end
  
end